# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Mihomo 配置项目 - 开发指南

个人自用的 mihomo (Clash.Meta) 代理配置项目，包含 YAML 配置文件和 JavaScript 覆写脚本。

## 目录结构

```
myself_mihomo_rules_bin/
├── *.js                    # 覆写脚本
├── *.yaml                  # 配置文件
├── download_mihomo_resources.sh # 下载 mihomo 官方文档脚本
├── mihomo/                     # 【官方资源】mihomo 官方文档（仅参考，不要修改）
│   ├── docs/                   # 官方配置文档
│   │   └── config/             # 配置模块文档
│   │       ├── dns/            # DNS 配置文档
│   │       ├── proxies/        # 代理节点文档
│   │       ├── proxy-groups/   # 策略组文档
│   │       ├── proxy-providers/ # 代理集合文档
│   │       ├── rule-providers/ # 规则集合文档
│   │       ├── rules/          # 路由规则文档
│   │       └── general.md      # 全局配置文档
│   └── example_config.yaml     # 官方完整配置示例
└── .gitignore                  # Git 忽略规则（忽略 mihomo 文件夹）
```

## 语言

中文：回复、注释、git commit 均用中文

## Mihomo 官方文档查询

**重要**：在修改配置前，请先进入 `mihomo/` 文件夹查阅相关模块的官方文档或示例。

### 查阅流程

1. **根据配置模块查找文档**：
   - DNS 配置 → `mihomo/docs/config/dns/`
   - 代理节点 → `mihomo/docs/config/proxies/`
   - 策略组 → `mihomo/docs/config/proxy-groups/`
   - 代理集合 → `mihomo/docs/config/proxy-providers/`
   - 规则集合 → `mihomo/docs/config/rule-providers/`
   - 路由规则 → `mihomo/docs/config/rules/`
   - 全局配置 → `mihomo/docs/config/general.md`

2. **参考官方完整示例**：
   - `mihomo/example_config.yaml`（⚠️ 大文件提示：此文件约 25KB，超过单次读取限制）
     - **推荐方式**：使用 `Grep` 工具搜索特定配置模块，如搜索 `dns:`, `proxies:`, `rules:` 等关键字
     - **分段读取**：使用 `offset` 和 `limit` 参数读取特定行数范围
     - **优先查阅文档**：先阅读 `mihomo/docs/config/` 中的模块文档，再针对性搜索示例

3. **验证语法**：
   - 查阅 `mihomo/docs/handbook/` 了解 YAML 语法

## 开发工作流

### 修改配置的步骤

1. **查阅官方文档**：根据要修改的模块，在 `mihomo/docs/config/` 中查找对应文档
2. **参考官方示例**：查看 `mihomo/example_config.yaml` 了解官方推荐配置
3. **修改配置**：编辑 YAML 配置文件或 JS 覆写脚本
4. **验证语法**：检查 YAML 语法、缩进是否正确
5. **测试生效**：在客户端中导入配置，测试是否按预期工作

### JS 覆写脚本编写规范

- 使用常量定义可复用配置（`groupBaseOption`, `yamlRule` 等）
- 使用扩展运算符合并配置（`...groupBaseOption`）
- 使用注释分隔配置区域（如 "// DNS配置"）
- 规则使用 `const` 数组定义，便于维护
