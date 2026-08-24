# China-friendly 运行指南（无需 Azure）

本分支是 [microsoft/ai-agents-for-beginners](https://github.com/microsoft/ai-agents-for-beginners) 的**国内可运行改造版**。本分支改造的是仓库内的**中文翻译版 notebook**（`translations/zh-CN/` 目录）——也就是你学习时实际打开的中文课程文件。

官方课程默认依赖 Microsoft Foundry / Azure OpenAI。但中国大陆的**个人账号**无法订阅 Azure OpenAI 服务，部署时会遇到：

```
CannotDeployDueToLocalRegulations: Due to local regulatory requirements, in
mainland China only enterprise customers with a registered business license are
eligible to subscribe to the Azure OpenAI Service.
```

本分支通过把**中文 notebook** 中的客户端替换为 OpenAI 兼容接口，绕开该限制，使用国内大模型即可学完整套课程（英文主体版保持官方原样，按需自行参考）。

---

## 改造了什么

- 中文翻译版 `translations/zh-CN/` 下所有 Python notebook 中的 `FoundryChatClient(...)` / `OpenAIChatClient(...)` 已替换为 `OpenAIChatCompletionClient(...)`（来自 `agent-framework-openai`）。
- 配置来源从 `AZURE_AI_PROJECT_ENDPOINT` / `AZURE_AI_MODEL_DEPLOYMENT_NAME` 改为读取以下环境变量：
  - `LLM_API_KEY` —— 模型服务商的 API Key
  - `LLM_BASE_URL` —— OpenAI 兼容的 API 基址（如 `https://api.moonshot.cn/v1`）
  - `LLM_MODEL` —— 模型 ID（如 `kimi-k2.6`）
- 顶部已自动 `import os`，并从 `.env` 读取配置。

---

## 支持的国内模型（任选其一，均为 OpenAI 兼容）

| 服务商 | `LLM_BASE_URL` | 示例模型 | 申请地址 |
|---|---|---|---|
| 月之暗面 Kimi | `https://api.moonshot.cn/v1` | `kimi-k2.6` | https://platform.moonshot.cn/ |
| MiniMax | `https://api.minimax.io/v1` | `MiniMax-M3` | https://platform.minimaxi.com/ |
| 通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-plus` | https://dashscope.console.aliyun.com/ |
| 硅基流动 SiliconFlow | `https://api.siliconflow.cn/v1` | `deepseek-ai/DeepSeek-V3` | https://siliconflow.cn/ |

> 只要服务商提供 **OpenAI 兼容的 `/v1/chat/completions`** 接口，都可以照此接入。

---

## 配置步骤

1. 复制环境变量模板：

   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env`，填入你选择的国内模型配置。以月之暗面 Kimi 为例：

   ```ini
   LLM_API_KEY="你的真实key"
   LLM_BASE_URL="https://api.moonshot.cn/v1"
   LLM_MODEL="kimi-k2.6"
   ```

   > ⚠️ `.env` 已被 `.gitignore` 忽略，不会进入版本库，请妥善保管。

---

## 安装与运行

```bash
# 1. 创建并激活虚拟环境（Python 3.12+）
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. 安装依赖（国内可用清华镜像加速）
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 3. 启动 Jupyter，打开 translations/zh-CN/ 下对应课程的中文 notebook
jupyter notebook translations/zh-CN/
```

每个中文 notebook 顶部已改为：

```python
import os
from agent_framework.openai import OpenAIChatCompletionClient

client = OpenAIChatCompletionClient(
    model=os.environ["LLM_MODEL"],
    api_key=os.environ["LLM_API_KEY"],
    base_url=os.environ["LLM_BASE_URL"],
)
```

直接 **Run All** 即可，无需 Azure 登录（`az login` 不再需要）。

---

## 暂未适配的中文 notebook（需 Azure 企业账号，已跳过）

以下中文 notebook 深度绑定 Azure 企业能力，个人账号无法运行，本分支**保持原样未改动**，学习时可跳过（均在 `translations/zh-CN/` 下）：

- `02-explore-agentic-frameworks/code_samples/02-python-agent-framework-azure-openai.ipynb`
- `06-building-trustworthy-agents/code_samples/06-human-in-the-loop.ipynb`
- `06-building-trustworthy-agents/code_samples/06-system-message-framework.ipynb`
- `15-browser-use/15-browser-user.ipynb`（依赖 `AZURE_OPENAI_*` + Playwright）
- `08-multi-agent/code_samples/workflows-agent-framework/python/04...aifoundry-condition.ipynb`（依赖 `AzureAIAgentClient`）

`translations/zh-CN/` 下其余 Lesson 00–18 的标准 `*-python-agent-framework.ipynb` 均已适配，可正常用国内模型运行。

---

## 注意事项

- **Thinking / 推理模型**：如 `kimi-k2.6` 是推理模型，notebook 中若设置了 `temperature`，请保持为 `1.0`（课程多数示例已如此设置；如遇报错把对应行改为 `temperature=1.0`）。
- **Lesson 16 的 Azure AI Search**：已改为「未配置 `AZURE_SEARCH_*` 时自动走内存检索」，可正常跑。
- 本分支为社区个人改造，**非微软官方支持**。如遇模型能力差异导致某示例效果不同，属正常现象。

---

## 与原版的关系

本分支仅为让国内个人开发者能本地运行中文课程而做的最小改造，改造范围限定在 `translations/zh-CN/` 下的 notebook。建议以官方仓库为准跟进更新；如官方未来原生支持 OpenAI 兼容提供商，可直接切回原版。
