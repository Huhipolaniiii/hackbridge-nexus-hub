
# Простой Python-скрипт для интеграции с Electron
def get_user_data():
    """Функция для получения данных пользователя"""
    return {
        "username": "test_user",
        "role": "hacker",
        "balance": 5000
    }

# Если скрипт запущен напрямую
if __name__ == "__main__":
    print("Python script executed!")
    print(get_user_data())
