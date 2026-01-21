from slowapi import Limiter  
from slowapi.util import get_remote_address

"SlowAPI is mainly used for rate limiting in FastAPI / Starlette applications. It protects your APIs from abuse, overload, and unintended heavy usage."
"The combination is used specifically for IP-based rate limiting in FastAPI / Starlette apps."

limiter = Limiter(key_func=get_remote_address)
