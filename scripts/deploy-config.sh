#!/bin/bash
# 部署 mihomo 配置文件并重启服务

# 项目根目录与配置目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_DIR="/home/mochen/.mihomo"

# 停止服务
echo "停止 mihomo.service..."
systemctl stop mihomo.service

# 复制配置文件
echo "复制配置文件到 $CONFIG_DIR/..."
cp "$PROJECT_DIR/configs/yaml/desktop.deploy.yaml" "$CONFIG_DIR/clash_no_specialApp.yaml"

# 启动服务
echo "启动 mihomo.service..."
systemctl start mihomo.service

echo "部署完成！"
