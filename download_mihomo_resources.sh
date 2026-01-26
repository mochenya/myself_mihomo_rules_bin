#!/bin/bash
# 下载 mihomo 资源：config.yaml 示例文件 + Meta-Docs 文档

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 创建目标目录
mkdir -p ./mihomo

echo "=========================================="
echo "开始下载 mihomo 资源"
echo "=========================================="

# ========== 任务1：下载 config.yaml ==========
echo ""
echo "[1/2] 正在下载 config.yaml 示例文件..."
curl -s -o ./mihomo/example_config.yaml \
  https://raw.githubusercontent.com/MetaCubeX/mihomo/refs/heads/Meta/docs/config.yaml

if [ $? -eq 0 ]; then
    echo "✓ config.yaml 已保存到 ./mihomo/example_config.yaml"
else
    echo "✗ config.yaml 下载失败"
    exit 1
fi

# ========== 任务2：克隆 Meta-Docs ==========
echo ""
echo "[2/2] 正在克隆 Meta-Docs 文档..."

TARGET_DIR="$SCRIPT_DIR/mihomo/docs"

# 清理旧目录（如果存在）
if [ -d "$TARGET_DIR" ]; then
    echo "⚠ 目标目录已存在，删除旧版本..."
    rm -rf "$TARGET_DIR"
fi

# 临时目录
TEMP_DIR=$(mktemp -d)

# 使用 sparse-checkout 只下载 docs 文件夹
git clone -q --depth 1 --filter=blob:none --sparse https://github.com/MetaCubeX/Meta-Docs.git "$TEMP_DIR"

cd "$TEMP_DIR"
git sparse-checkout set docs
cd - > /dev/null

# 移动到目标位置
mv "$TEMP_DIR/docs" "$TARGET_DIR"

# 清理临时目录
rm -rf "$TEMP_DIR"

# 删除多语言文件，只保留中文
echo "正在清理不需要的文件..."
find "$TARGET_DIR" -type f -name "*.en.md" -delete
find "$TARGET_DIR" -type f -name "*.ru.md" -delete

# 删除指定文件和文件夹
rm -f "$TARGET_DIR/index.md"
rm -f "$TARGET_DIR/groups.md"
rm -f "$TARGET_DIR/CNAME"
rm -rf "$TARGET_DIR/startup"
rm -rf "$TARGET_DIR/assets"

echo "✓ docs 文件夹已克隆到 ./mihomo/docs"
echo "✓ 已清理多语言文件和其他不需要的文件"

# ========== 完成 ==========
echo ""
echo "=========================================="
echo "✓ 所有资源下载完成！"
echo "=========================================="
