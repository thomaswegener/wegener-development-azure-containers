<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wegener Development - Secure Login</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        
        
        <div class="card-container">
            <div class="card" id="flip-card">
                <div class="card-front">
                    <img src="wdev.png" alt="Wegener Development Logo" class="logo">
                </div>
                <div class="card-back">
                    <form>
                        <h2>Sign In</h2>
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" required>
                        
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                        
                        <button type="submit">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
