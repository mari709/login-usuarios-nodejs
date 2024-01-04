// app.js

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Configuración de express-session
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true,
}));

app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rutas
app.get('/register', (req, res) => {
    res.render('auth/register');
});

app.post('/register', async (req, res) => {
    const { name, email, password, repassword } = req.body;

    // Validación de contraseña y confirmación de contraseña
    if (password !== repassword) {
        return res.render('auth/register', {
            error: 'Las contraseñas no coinciden. Por favor, vuelve a ingresarlas.',
        });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar usuario en la base de datos (simulado)
    // En una aplicación real, utiliza un modelo para interactuar con la base de datos
    const user = {
        name,
        email,
        password: hashedPassword,
    };

    // Simulación de almacenamiento en la base de datos
    // users.push(user);

    // Redirigir a la página de inicio de sesión después del registro exitoso
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('auth/login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Buscar el usuario en la base de datos (simulado)
    // En una aplicación real, utiliza un modelo para interactuar con la base de datos
    const user = {
        email: 'test@example.com',
        // hashedPassword: obtenido de la base de datos
        password: await bcrypt.hash('password123', 10),
    };

    // Verificar las credenciales del usuario
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        req.session.userId = 1; // Almacenar el ID del usuario en la sesión (simulado)
        res.redirect('/dashboard'); // Redirigir a la página de dashboard después del inicio de sesión exitoso
    } else {
        res.render('auth/login', {
            error: 'Credenciales incorrectas. Por favor, vuelve a intentarlo.',
        });
    }
});

app.get('/dashboard', (req, res) => {
    // Verificar si el usuario está autenticado
    if (req.session.userId) {
        res.send('¡Bienvenido al dashboard!');
    } else {
        res.redirect('/login');
    }
});

app.listen(3000, () => {
    console.log('Servidor en funcionamiento en http://localhost:3000');
});
