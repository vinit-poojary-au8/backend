var express = require('express')
var router = express.Router()
var cookieParser = require('cookie-parser')
var jsonpatch = require('json-patch')
var imageFunc = require('./middleware/imageDownload')

router.use(express.urlencoded({ extended: true }))
router.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
var User = require('./User')

router.post('/', (req, res) => {
	User.create(
		{
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
		},
		(err, user) => {
			if (err)
				return res
					.status(500)
					.send(
						'There was a problem adding the information to the database.'
					)
			res.status(200).send(user)
		}
	)
})

router.post('/jsonpatch', verifyToken, (req, res) => {
	jsonpatch.apply(req.body.jsonObject, req.body.jsonPatch)
	res.json({
		Patched: req.body.jsonObject,
	})
})

router.post('/image', verifyToken, imageFunc, (req, res) => {})

router.get('/', (req, res) => {
	User.find({}, (err, users) => {
		if (err) return res.status(500).send('There was a problem finding the users.')
		res.status(200).send(users)
	})
})

router.route('/:id')
	.get((req, res) => {
		User.findById(req.params.id, (err, user) => {
			if (err)
				return res
					.status(500)
					.send('There was a problem finding the user.')
			if (!user) return res.status(404).send('No user found.')
			res.status(200).send(user)
		})
	})
	.delete((req, res) => {
		User.findByIdAndRemove(req.params.id, (err, user) => {
			if (err)
				return res
					.status(500)
					.send('There was a problem deleting the user.')
			res.status(200).send('User: ' + user.name + ' was deleted.')
		})
	})
	.put((req, res) => {
		User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
			if (err)
				return res
					.status(500)
					.send('There was a problem updating the user.')
			res.status(200).send(user)
		})
	}).patch((req, res) => {
		User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
			if (err)
				return res
					.status(500)
					.send('There was a problem updating the user.')
			res.status(200).send(user)
		})
	})

module.exports = router
