const express = require('express')
const bcrypt = require('bcrypt')
const upload = require('../uploads/files-upload')
const Post = require('../schema/PostSchema')
const profileImageUpload = require('../uploads/profileImage-upload')
const User = require('../schema/UserSchema')
const Comment = require('../schema/CommentSchema')
const router = express.Router()


router.get('/', (req, res) => {
    res.send(`<h1>Server working perfectly.</h1>`)
})

// ----- USER -----
// Register
router.post('/api/register', profileImageUpload.single("profileImage"), async (req, res) => {
    try {
        const { fullname, username, email, phone, password } = req.body
        const profileImage = req.file.filename

        // Verificar si el usuario o el correo electrónico ya están registrados
        const existingUser = await User.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (existingUser) {
            return res.status(409).json({ message: 'El usuario o el correo electrónico ya están registrados' });
        }

        // Generar hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const user = new User({
            profileImage,
            fullname,
            username,
            email,
            phone,
            password: hashedPassword,
            dateJoined: Date.now()
        });

        // Guardar el usuario en la base de datos
        await user.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
})

// Login
router.post('/api/login', upload.none(), async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Buscar al usuario por email, username o phone
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername },
            ],
        });

        if (!user) {
            return res.status(404).json({ message: 'El usuario no existe' });
        }

        // Verificar la contraseña
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ logged: true, user: user, message: 'Inicio de sesión exitoso' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Get all users
router.get('/api/get-users', async (req, res) => {
    try {
        const users = await User.find()
        if (!users) return res.status(404).json([])

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
})

// Delete user
router.delete('/api/delete-user/:username', async (req, res) => {
    try {
        const { username } = req.params

        const userToDelete = await User.findOneAndDelete({ username: username })

        if (!userToDelete) return res.status(404).json({ message: "Usuario no encontrado" })

        await Post.deleteMany({ username: username })

        res.status(200).json({ message: "Usuario eliminado" })
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})


// ----- POSTS -----
// Make post
router.post('/api/make-post', upload.array("files"), async (req, res) => {
    try {
        const { fullname, username, description, profileImage } = req.body

        const newPost = new Post({
            profileImage,
            fullname,
            username,
            date: Date.now(),
            description,
            filesContent: req.files,
            likes: [],
            comments: [],
            views: [],
            saved: [],
        })

        await newPost.save()

        return res.status(201).json({ message: "Post created successfully!" })
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

// Get all posts
router.get('/api/get-posts', async (req, res) => {
    try {
        const posts = await Post.find()

        if (!posts) return res.status(404).json([])

        if (posts) return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

// Delete post
router.delete('/api/delete-post/:postID', async (req, res) => {
    try {
        const { postID } = req.params

        await Post.findOneAndDelete({ _id: postID })

        res.status(200).json({ message: "Post deleted successfully!" })
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})


// Edit post content
router.patch('/api/edit-post/:postID', async (req, res) => {
    try {
        const { newContent } = req.body;
        const { postID } = req.params;

        const updatedPost = await Post.findOneAndUpdate(
            { _id: postID },
            { $set: { description: newContent }, $inc: { __v: 1 } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'No se encontró el post' });
        }

        return res.status(200).json({ message: 'Post actualizado correctamente', post: updatedPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});


// Make like
router.get('/api/make-like/:username/:postID', async (req, res) => {
    try {
        const { username, postID } = req.params;

        const existingPost = await Post.findOne({ _id: postID });

        if (!existingPost) {
            return res.status(404).json({ message: 'No se encontró el post' });
        }

        let updatedPost;
        let liked;

        if (existingPost.likes.includes(username)) {
            // Si el usuario ya existe en el array "likes", eliminarlo
            updatedPost = await Post.findOneAndUpdate(
                { _id: postID },
                { $pull: { likes: username } },
                { new: false }
            );

            liked = false;
        } else {
            // Si el usuario no existe en el array "likes", agregarlo
            updatedPost = await Post.findOneAndUpdate(
                { _id: postID },
                { $push: { likes: username } },
                { new: false }
            );

            liked = true;
        }

        return res.status(200).json({ liked });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});


// Manage if user set like or no
router.get('/api/get-like/:username/:postID', async (req, res) => {
    try {
        const { username, postID } = req.params

        const postToLike = await Post.findOne({ _id: postID })

        if (!postToLike.likes.includes(username)) {
            return res.status(200).json({ liked: false })
        } else {
            return res.status(200).json({ liked: true })
        }

    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

// Get post comments
router.get('/api/get-comments/:postID', async (req, res) => {
    try {
        const { postID } = req.params
        const { comment } = req.body
        const postComments = await Post.findOne({ _id: postID })

        if (!postComments) return res.status(404).json({ message: "Post not found" })

        res.status(200).json(postComments.comments)
    } catch (error) {
        console.log(error)
    }
})

// Make post comment
router.post('/api/make-comment/:postID', upload.none(), async (req, res) => {
    try {
        const { postID } = req.params
        const { profileImage, username, comment } = req.body

        const newComment = new Comment({
            profileImage,
            username,
            date: Date.now(),
            comment,
            replies: [],
            likes: []
        })

        updatedPostComments = await Post.findOneAndUpdate(
            { _id: postID },
            { $pull: { comments: newComment } },
            { new: false }
        );

        if (!updatedPostComments) return res.status(404).json({ message: "No se encontró el post" })

        res.status(200).json(newComment)
    } catch (error) {
        console.log(error)
    }
})

// Make comment reply
router.post('/api/make-comment-reply/:postID/:commentID', async (req, res) => {
    try {

        const { postID, commentID } = req.params
        console.log(req.body)


    } catch (error) {
        console.log(error)
    }
})



// ----- SEARCH - USERS -----
router.get('/api/search/:searchValue', upload.none(), async (req, res) => {
    try {
        const { searchValue } = req.params

        const Users = await User.find({ $or: [{ fullname: searchValue }, { username: searchValue }] })

        if (!Users) {
            return res.status(404).json([])
        }

        return res.status(200).json(Users)
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

module.exports = router