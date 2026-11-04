# Repository Guidelines

## 项目结构与职责

本仓库维护 Mihomo 的 YAML 配置、Clash 客户端 JS 覆写脚本和辅助脚本：

- `configs/yaml/`：包含桌面、安卓和安卓 Tailscale 公开配置；`*.deploy.yaml` 是不纳入 Git 的个人部署配置。
- `configs/js/`：安卓客户端覆写脚本；`android-ads.js` 额外启用广告拦截。
- `providers/filter.yaml`：自用域名过滤规则。
- `scripts/`：本机部署与上游参考资料下载脚本。
- `mihomo/docs/`、`mihomo/example_config.yaml`：本地上游参考资料，可能缺失或过时；`mihomo/CLAUDE.md` 提供补充说明。

## Mihomo 资料与问题排查

修改或排查 Mihomo 配置时，优先查本地 `mihomo/docs/` 和示例配置；按需使用 Context7 或联网查询，并核对本地文档是否过时。上游项目为 [MetaCubeX/mihomo](https://github.com/MetaCubeX/mihomo)，官方文档为 [MetaCubeX Docs](https://wiki.metacubex.one/)。遇到错误或兼容性问题，可搜索上游 GitHub issues 和 pull requests，结合版本与实际日志判断其是否适用。

## 修改与验证

遵循现有格式：YAML 使用两空格缩进；JS 沿用现有两空格缩进和对象风格；Shell 脚本使用 Bash。配置和脚本名称使用小写及连字符，个人配置使用 `.deploy.yaml` 后缀。规则按顺序匹配，调整时检查专用规则是否位于通用规则之前，并同步检查相关 YAML 和 JS。

仓库没有构建步骤、已配置的测试框架或覆盖率要求。根据改动运行适当检查：

```bash
prettier --check 'configs/yaml/*.yaml' 'configs/js/*.js' providers/filter.yaml
bash -n scripts/*.sh
node --check configs/js/android.js
node --check configs/js/android-ads.js
ruby -e 'require "yaml"; Dir["configs/yaml/*.yaml"].each { |f| YAML.load_file(f, aliases: true) }'
git diff --check
```

需要格式化时，使用 `prettier --write` 并指定相同的目标文件。项目使用 Prettier 默认格式；个人部署配置和本地上游资料在 `.prettierignore` 中排除。

语法检查不能证明代理连接或规则实际命中；需要时使用对应 Mihomo 版本验证配置，并说明未验证的运行行为。

## 安全与部署

`*.deploy.yaml` 可能包含订阅凭据：保持 Git 忽略，勿在日志、提交或文档中暴露内容。`scripts/deploy-config.sh` 会复制配置并停止、启动本机服务；执行前确认目标、影响和授权。`scripts/download-mihomo-resources.sh` 会替换本地上游文档，运行前检查是否有需要保留的更改。

## 提交与拉取请求

提交使用 Conventional Commits，例如 `feat: add Claude proxy routing` 或 `fix(dns): correct resolver policy`。PR 应描述变更目的、影响的配置或平台、验证命令及结果，并在适用时关联 issue。结构、操作流程或验证方式发生实质变化时，同步更新本指南。
