import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password, name, email, studentId } = await request.json()

    // 验证必要字段
    if (!username || !password || !name) {
      return NextResponse.json(
        { 
          error: '参数不完整', 
          message: '创建用户需要提供用户名、密码和姓名',
          missing_fields: [
            !username ? 'username' : null,
            !password ? 'password' : null,
            !name ? 'name' : null
          ].filter(Boolean)
        },
        { status: 400 }
      )
    }

    // 检查API Token是否配置
    if (!process.env.AUTHENTIK_API_TOKEN) {
      console.error('Authentik API Token未配置')
      return NextResponse.json(
        { 
          error: '系统配置错误',
          message: 'Authentik API Token未配置，请联系管理员'
        },
        { status: 500 }
      )
    }

    // 检查API URL是否配置
    if (!process.env.AUTHENTIK_API_URL) {
      console.error('Authentik API URL未配置')
      return NextResponse.json(
        { 
          error: '系统配置错误',
          message: 'Authentik API URL未配置，请联系管理员'
        },
        { status: 500 }
      )
    }

    // 准备Authentik API请求头
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Accept', 'application/json')
    headers.append('Authorization', `Bearer ${process.env.AUTHENTIK_API_TOKEN}`)

    // 准备请求体
    const payload = JSON.stringify({
      username,
      name,
      is_active: true,
      email: email || `${studentId}@mail.nwpu.edu.cn`,
      attributes: {
        studentId,
      },
      path: "users",
      type: "internal",
      password
    })

    // 尝试发送创建用户请求到Authentik
    let authentikResponse;
    try {
      authentikResponse = await fetch(
        `${process.env.AUTHENTIK_API_URL}/api/v3/core/users/`,
        {
          method: 'POST',
          headers,
          body: payload,
        }
      )
    } catch (fetchError) {
      console.error('Authentik API连接错误:', fetchError)
      return NextResponse.json(
        { 
          error: '无法连接到认证服务', 
          message: '连接Authentik服务失败，请检查网络或联系管理员',
          details: fetchError instanceof Error ? fetchError.message : '未知连接错误'
        },
        { status: 503 }
      )
    }

    if (!authentikResponse.ok) {
      let errorData;
      try {
        errorData = await authentikResponse.json();
      } catch {
        errorData = { raw_response: await authentikResponse.text().catch(() => '无法读取响应') };
      }
      
      console.error('Authentik API错误:', errorData)
      
      // 处理常见错误情况
      if (authentikResponse.status === 400) {
        // 检查是否是用户名已存在错误
        if (errorData.username && 
           (errorData.username.includes('unique') || 
            errorData.username.some((msg: string) => msg.includes('unique')))) {
          return NextResponse.json(
            { 
              error: '用户名已存在',
              message: '该用户名已在Authentik中注册',
              username
            },
            { status: 409 }
          )
        }
        
        // 其他字段验证错误
        return NextResponse.json(
          { 
            error: '用户信息验证失败',
            message: '创建用户时数据验证失败，请检查提供的信息',
            details: errorData
          },
          { status: 400 }
        )
      }
      
      if (authentikResponse.status === 401 || authentikResponse.status === 403) {
        // 授权错误
        return NextResponse.json(
          { 
            error: 'API授权失败',
            message: 'Authentik API授权失败，请联系管理员更新API令牌',
            status_code: authentikResponse.status
          },
          { status: 500 }
        )
      }
      
      if (authentikResponse.status === 409) {
        // 用户已存在
        return NextResponse.json(
          { 
            error: '用户已存在',
            message: '该用户名已在Authentik中注册',
            username
          },
          { status: 409 }
        )
      }
      
      // 其他错误
      return NextResponse.json(
        { 
          error: '创建用户失败', 
          message: '与认证系统交互失败',
          status_code: authentikResponse.status,
          details: errorData 
        },
        { status: 500 }
      )
    }

    const userData = await authentikResponse.json()
    
    // 确保用户创建成功后，显式设置密码
    try {
      const userId = userData.pk || userData.id;
      console.log(`正在为用户ID ${userId} 设置密码`);
      
      const setPasswordPayload = JSON.stringify({
        password
      });
      
      const setPasswordResponse = await fetch(
        `${process.env.AUTHENTIK_API_URL}/api/v3/core/users/${userId}/set_password/`,
        {
          method: 'POST',
          headers,
          body: setPasswordPayload,
        }
      );
      
      if (!setPasswordResponse.ok) {
        console.error('设置密码失败:', await setPasswordResponse.text().catch(() => '无法读取响应'));
        // 即使设置密码失败，我们仍然继续，因为用户已经创建
        console.warn('用户已创建但密码设置失败，用户可能需要重置密码');
      } else {
        console.log('密码设置成功');
      }
    } catch (passwordError) {
      console.error('设置密码时出错:', passwordError);
      // 继续处理，不中断流程
    }

    return NextResponse.json({
      success: true,
      message: '用户创建成功',
      user: {
        id: userData.pk || userData.id, // 确保返回正确的ID字段
        username: userData.username,
      }
    })
  } catch (error) {
    console.error('处理创建用户请求时出错:', error)
    return NextResponse.json(
      { 
        error: '创建用户失败', 
        message: '处理请求时发生未预期的错误',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
} 