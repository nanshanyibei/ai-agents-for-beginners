# 什么是智能体框架
任务管理：
多任务时代理框架帮助我们决定哪个代理完成哪个任务
代理人专注于完成任务

比如去订酒店，需要知道是否有酒店房间可供预定，aentic框架使我们更好地管理这种上下文
代理协作：代理如何协同完成任务，取决于我们来定义，代理框架使我们更有效的做这点，代理框架创建空间并使用协议，使代理之间能够相互通信，这些框架还附带一些工具或连接，使我们能够观察并评估我们代理商的绩效


智能体需要上下文和环境信息

Azure AI：仅设计用于单个代理，既可以通过代码，也可以通过用户界面
图形框架：语义内核和自动生成
语义内核：一方面是一个企业聚焦框架，背后的团队真正专注于开发，为其在生成环境中构建人工智能代理的团队提供经验，为各种语言提供支持，与其他模型服务的各种不同连接器


不用Agent Framework，自己写Agent：
```
import os, json
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

# ① 自己建立与 Kimi 的连接
client = OpenAI(
    api_key=os.environ["LLM_API_KEY"],
    base_url=os.environ["LLM_BASE_URL"],
)
MODEL = os.environ["LLM_MODEL"]

# ② 自己写工具函数（业务逻辑）
def check_destination_availability(destination: str) -> str:
    """检查某个度假目的地当前是否可预订。"""
    available = {"Barcelona": True, "Tokyo": True, "Cape Town": False,
                 "Vancouver": True, "Dubai": False}
    is_available = available.get(destination, False)
    return f"{destination} {'可预订' if is_available else '不可预订'}。"

# ③ 自己手写工具的 JSON Schema（框架会替你做这件事）
tools = [{
    "type": "function",
    "function": {
        "name": "check_destination_availability",
        "description": "检查某个度假目的地当前是否可预订。",
        "parameters": {
            "type": "object",
            "properties": {
                "destination": {"type": "string", "description": "要查询可用性的目的地"}
            },
            "required": ["destination"],
        },
    },
}]

# ④ 自己维护对话上下文（messages 列表）
messages = [
    {"role": "system", "content": "你是一个旅行预订代理。在推荐前务必检查目的地可用性。"},
    {"role": "user", "content": "东京能预订吗？如果可以，再告诉我温哥华呢？"},
]

print("=== 开始原生 SDK 手写 Agent Loop ===")
# ⑤ 自己写 Agent Loop：调 LLM → 解析 tool_calls → 执行 → 回灌 → 再调
for turn in range(5):
    resp = client.chat.completions.create(
        model=MODEL, messages=messages, tools=tools, temperature=1.0
    )
    msg = resp.choices[0].message

    if msg.tool_calls:
        # 把 assistant 的 tool_calls 原样记回上下文
        messages.append({
            "role": "assistant",
            "content": msg.content or "",
            "tool_calls": [
                {"id": tc.id, "type": "function",
                 "function": {"name": tc.function.name, "arguments": tc.function.arguments}}
                for tc in msg.tool_calls
            ],
        })
        for tc in msg.tool_calls:
            args = json.loads(tc.function.arguments)
            print(f"[工具调用] {tc.function.name}({args})")
            result = check_destination_availability(**args)
            print(f"[工具结果] {result}")
            # 把工具结果回灌，让 LLM 继续
            messages.append({"role": "tool", "tool_call_id": tc.id, "content": result})
    else:
        print(f"智能体：{msg.content}")
        break

```