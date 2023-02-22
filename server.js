const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl')
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    console.log(req.body.fullUrl)
    await ShortUrl.create({ fullUrl: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.fullUrl)

})
app.listen(5005);