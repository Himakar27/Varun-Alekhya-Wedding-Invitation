Set WshShell = CreateObject("WScript.Shell")
strPath = WshShell.CurrentDirectory & "\index.html"
chromePath32 = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
chromePath64 = "C:\Program Files\Google\Chrome\Application\chrome.exe"
edgePath32 = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
edgePath64 = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"

Set fso = CreateObject("Scripting.FileSystemObject")

If fso.FileExists(chromePath32) Then
    WshShell.Run """" & chromePath32 & """ --autoplay-policy=no-user-gesture-required """ & strPath & """", 1, False
ElseIf fso.FileExists(chromePath64) Then
    WshShell.Run """" & chromePath64 & """ --autoplay-policy=no-user-gesture-required """ & strPath & """", 1, False
ElseIf fso.FileExists(edgePath32) Then
    WshShell.Run """" & edgePath32 & """ --autoplay-policy=no-user-gesture-required """ & strPath & """", 1, False
ElseIf fso.FileExists(edgePath64) Then
    WshShell.Run """" & edgePath64 & """ --autoplay-policy=no-user-gesture-required """ & strPath & """", 1, False
Else
    WshShell.Run """" & strPath & """", 1, False
End If
