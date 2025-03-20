#!/usr/bin/env python3

import argparse
import sys
from datetime import datetime
from typing import List, Dict, Optional
import pymongo
import random
import string
from pymongo.database import Database
from pymongo.collection import Collection

def generate_password(length: int = 12) -> str:
    """生成随机密码（仅包含字母和数字）"""
    letters = string.ascii_letters
    digits = string.digits
    # 确保密码至少包含一个字母和一个数字
    password = random.choice(letters)  # 第一个字符必须是字母
    password += random.choice(digits)  # 第二个字符必须是数字
    # 剩余字符随机选择字母或数字
    remaining_chars = ''.join(random.choice(letters + digits) for _ in range(length - 2))
    password += remaining_chars
    # 打乱顺序
    password_list = list(password)
    random.shuffle(password_list)
    return ''.join(password_list)

def generate_username(student_id: str) -> str:
    """根据学号生成用户名"""
    return f"v5_{student_id}"

def connect_db(uri: str = "mongodb://localhost:27017") -> Database:
    """连接到 MongoDB 数据库"""
    client = pymongo.MongoClient(uri)
    return client.v5embark

def get_enrolled_collection(db: Database) -> Collection:
    """获取已录取学生集合"""
    return db.enrolledstudents

def add_student(collection: Collection, student_id: str, name: str, username: str) -> bool:
    """添加单个学生到录取名单"""
    try:
        # 检查学号是否已存在
        if collection.find_one({"studentId": student_id}):
            print(f"错误: 学号 {student_id} 已存在")
            return False
        
        # 检查用户名是否已存在
        if collection.find_one({"username": username}):
            print(f"错误: 用户名 {username} 已存在")
            return False
        
        # 生成密码
        initial_password = generate_password()
        
        # 添加学生
        result = collection.insert_one({
            "studentId": student_id,
            "name": name,
            "username": username,
            "initialPassword": initial_password,
            "enrolledAt": datetime.now()
        })
        print(f"成功: 已添加学生 {name}（学号：{student_id}）")
        print(f"用户名: {username}")
        print(f"初始密码: {initial_password}")
        return True
    except Exception as e:
        print(f"错误: 添加学生失败 - {str(e)}")
        return False

def add_students_from_file(collection: Collection, file_path: str) -> bool:
    """从文件批量添加学生"""
    try:
        successful = 0
        failed = 0
        print("\n添加的学生凭据:")
        print("学号\t\t姓名\t\t用户名\t\t初始密码")
        print("-" * 80)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                
                parts = line.split(',')
                if len(parts) != 3:  # 现在需要三个字段：学号,姓名,用户名
                    print(f"错误: 无效的行格式 - {line}")
                    print("正确格式: 学号,姓名,用户名")
                    failed += 1
                    continue
                
                student_id, name, username = parts
                student_id = student_id.strip()
                name = name.strip()
                username = username.strip()
                
                # 检查学号是否已存在
                if collection.find_one({"studentId": student_id}):
                    print(f"错误: 学号 {student_id} 已存在")
                    failed += 1
                    continue

                # 检查用户名是否已存在
                if collection.find_one({"username": username}):
                    print(f"错误: 用户名 {username} 已存在")
                    failed += 1
                    continue
                
                try:
                    # 生成密码
                    initial_password = generate_password()
                    
                    collection.insert_one({
                        "studentId": student_id,
                        "name": name,
                        "username": username,
                        "initialPassword": initial_password,
                        "enrolledAt": datetime.now()
                    })
                    print(f"{student_id}\t{name}\t{username}\t{initial_password}")
                    successful += 1
                except Exception as e:
                    print(f"错误: 添加学生 {student_id} 失败 - {str(e)}")
                    failed += 1
        
        print(f"\n总结: 成功添加 {successful} 名学生，失败 {failed} 名")
        return failed == 0
    except Exception as e:
        print(f"错误: 读取文件失败 - {str(e)}")
        return False

def list_students(collection: Collection) -> None:
    """列出所有已录取学生"""
    students = collection.find().sort("studentId", 1)
    print("\n已录取学生列表:")
    print("学号\t\t姓名\t\t用户名\t\t初始密码\t\t录取时间")
    print("-" * 100)
    for student in students:
        print(f"{student['studentId']}\t{student['name']}\t{student.get('username', 'N/A')}\t{student.get('initialPassword', 'N/A')}\t{student['enrolledAt'].strftime('%Y-%m-%d %H:%M')}")

def remove_student(collection: Collection, student_id: str) -> bool:
    """删除单个学生"""
    try:
        result = collection.delete_one({"studentId": student_id})
        if result.deleted_count > 0:
            print(f"成功: 已删除学号为 {student_id} 的学生")
            return True
        else:
            print(f"错误: 未找到学号为 {student_id} 的学生")
            return False
    except Exception as e:
        print(f"错误: 删除学生失败 - {str(e)}")
        return False

def main():
    parser = argparse.ArgumentParser(description="V5战队录取信息管理工具")
    parser.add_argument("--uri", default="mongodb://localhost:27017", help="MongoDB 连接字符串")
    
    subparsers = parser.add_subparsers(dest="command", help="可用命令")
    
    # 添加单个学生
    add_parser = subparsers.add_parser("add", help="添加单个学生")
    add_parser.add_argument("student_id", help="学号")
    add_parser.add_argument("name", help="姓名")
    add_parser.add_argument("username", help="用户名")
    
    # 从文件批量添加学生
    bulk_parser = subparsers.add_parser("bulk", help="从文件批量添加学生")
    bulk_parser.add_argument("file", help="CSV文件路径（格式：学号,姓名,用户名）")
    
    # 列出所有学生
    list_parser = subparsers.add_parser("list", help="列出所有已录取学生")
    
    # 删除学生
    remove_parser = subparsers.add_parser("remove", help="删除学生")
    remove_parser.add_argument("student_id", help="要删除的学生学号")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    try:
        db = connect_db(args.uri)
        collection = get_enrolled_collection(db)
        
        if args.command == "add":
            add_student(collection, args.student_id, args.name, args.username)
        elif args.command == "bulk":
            add_students_from_file(collection, args.file)
        elif args.command == "list":
            list_students(collection)
        elif args.command == "remove":
            remove_student(collection, args.student_id)
    except Exception as e:
        print(f"错误: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 