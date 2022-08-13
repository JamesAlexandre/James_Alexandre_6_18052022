const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject.userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    userLiked: [],
    userDisliked: [],
  });

  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject.userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Elément modifié" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Elément supprimé" }))
            .catch((error) => res.status(404).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.postLikes = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      sauce = new Sauce(sauce);

      if (like === 1 && !sauce.usersLiked.includes(userId)) {
        sauce.usersLiked.push(userId);
        sauce.likes++;
      } else if (like === 0 && sauce.usersLiked.includes(userId)) {
        for (let i = 0; i < sauce.usersLiked.length; i++) {
          if (sauce.usersLiked[i] === userId) {
            sauce.usersLiked.splice(i, 1);
          }
        }
        sauce.likes--;
      }

      if (like === -1 && !sauce.usersDisliked.includes(userId)) {
        sauce.usersDisliked.push(userId);
        sauce.dislikes++;
      } else if (like === 0 && sauce.usersDisliked.includes(userId)) {
        for (let i = 0; i < sauce.usersDisliked.length; i++) {
          if (sauce.usersDisliked[i] === userId) {
            sauce.usersDisliked.splice(i, 1);
          }
        }
        sauce.dislikes--;
      }
      sauce
        .save()
        .then(() => res.status(201).json({ message: "Like" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
