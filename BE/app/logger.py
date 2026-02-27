import logging
import os
from logging.handlers import RotatingFileHandler

# Create logs directory if it doesn't exist
log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "logs")
os.makedirs(log_dir, exist_ok=True)

# Logger configuration
logger = logging.getLogger("shikshak_backend")
logger.setLevel(logging.INFO)

# Formatter
formatter = logging.Formatter(
    fmt="%(asctime)s | %(levelname)-8s | %(module)s.%(funcName)s:%(lineno)d - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# 1. Console / Terminal Handler
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# 2. File Handler (Rotating log to prevent infinite growth)
log_file = os.path.join(log_dir, "app.log")
file_handler = RotatingFileHandler(
    log_file, 
    maxBytes=5 * 1024 * 1024, # 5 MB per file
    backupCount=3,            # Keep 3 backups
    encoding="utf-8"
)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# Prevent logging from propagating to the root logger to avoid duplicate prints
logger.propagate = False
