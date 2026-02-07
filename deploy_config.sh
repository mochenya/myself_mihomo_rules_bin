#!/bin/bash
# 部署 mihomo 配置文件并重启服务

# 配置目录（使用绝对路径，避免 sudo 导致 ~ 展开错误）
CONFIG_DIR="/home/mochen/.mihomo"

# 停止服务
echo "停止 mihomo.service..."
systemctl stop mihomo.service

# 复制配置文件
echo "复制配置文件到 $CONFIG_DIR/..."
cp clash.yaml "$CONFIG_DIR/clash.yaml"
cp clash_no_specialApp_my.yaml "$CONFIG_DIR/clash_no_specialApp.yaml"

# 启动服务
echo "启动 mihomo.service..."
systemctl start mihomo.service

echo "部署完成！"
