import os
import logging
import logging_loki

LOKI_URL = os.environ.get("LOKI_URL", "http://loki-gateway.loki.svc.cluster.local/loki/api/v1/push")

loki_handler = logging_loki.LokiHandler(
    url=LOKI_URL,
    tags={"service": "user-manager-server", "env": "production"},
    version="1",
)

stdout_handler = logging.StreamHandler()
stdout_handler.setFormatter(
    logging.Formatter(
        '{"time":"%(asctime)s","level":"%(levelname)s",'
        '"service":"user-manager-server","message":"%(message)s"}'
    )
)

logger = logging.getLogger("user-manager-server")
logger.setLevel(logging.INFO)
logger.addHandler(loki_handler)
logger.addHandler(stdout_handler)
