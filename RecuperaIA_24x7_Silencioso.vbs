' Inicializador Silencioso 24/7 para RecuperaIA
' Executa o servidor HTTP em segundo plano no Windows sem janelas de terminal

Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\luciano\.gemini\antigravity\scratch\recuperaia"
WshShell.Run "cmd.exe /c node server.js", 0, False
