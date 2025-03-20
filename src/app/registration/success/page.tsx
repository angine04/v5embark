"use client";

import { RegistrationLayout } from "@/components/layout/RegistrationLayout";
import { useInitialFormStore, useCredentialsStore } from "@/store/registration";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const { formData: initialFormData } = useInitialFormStore();
  const { formData: credentialsData } = useCredentialsStore();
  const router = useRouter();

  useEffect(() => {
    // 如果没有初始信息，重定向到首页
    if (!initialFormData.studentId || !initialFormData.name) {
      router.push("/");
      return;
    }
  }, [initialFormData, router]);

  return (
    <RegistrationLayout
      instructions={
        <div className="space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            欢迎加入V5++
          </h1>
          <div className="space-y-4 text-base md:text-xl text-gray-600">
            <p>您已成功完成注册！接下来：</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                &nbsp;使用您设置的账号密码登录
                <a
                  href="https://key.npu5v5.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  v5Key
                </a>
              </li>
              <li>
                &nbsp;查看
                <a
                  href="https://atlas.npu5v5.cn/doc/5z65zyw5pyn5yqh5l255so6k05pio-bwHn7hg17S"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  这篇文档
                </a>
                ，探索团队服务
              </li>
              <li>
                &nbsp;访问
                <a
                  href="https://beacon.npu5v5.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  v5Beacon
                </a>
                ，开启服务门户
              </li>
              <li>
                &nbsp;加入QQ群：
                <a
                  href="https://qm.qq.com/q/g7JJ72qltS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  451279735
                </a>
              </li>
                <li>
                  &nbsp;请于3月21日19:00到<b>计算机学院126</b>报到
                </li>
            </ol>
          </div>
        </div>
      }
    >
      <div className="space-y-6 ">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">注册成功</h2>
            <p className="text-gray-600">您的信息已提交</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="mt-2 p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              您的账号信息
            </h3>

              <ul className="text-gray-600">
              <li>
                  姓名：{initialFormData.name}
                </li>
                <li>
                  学号：{initialFormData.studentId}
                </li>
                <li>
                  用户名：{credentialsData.username}
                </li>
            </ul>

          </div>
        </div>
      </div>
    </RegistrationLayout>
  );
}
