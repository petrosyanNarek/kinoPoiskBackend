const { Sequelize } = require("sequelize");
const configDataBase = require("../configDataBase");

const sequelize = new Sequelize(
  configDataBase.DB,
  configDataBase.USER,
  configDataBase.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

const User = require("./user")(sequelize, Sequelize);
const Genre = require("./genre")(sequelize, Sequelize);
const Category = require("./category")(sequelize, Sequelize);
const Film = require("./film")(sequelize, Sequelize);
const Country = require("./country")(sequelize, Sequelize);
const FilmGenre = require("./film_Genre")(sequelize, Sequelize);
const FilmCountry = require("./film_Country")(sequelize, Sequelize);
const Series = require("./series")(sequelize, Sequelize);
const Comment = require("./comment")(sequelize, Sequelize);
const Actor = require("./actor")(sequelize, Sequelize);
const ActorFilm = require("./actorFilm")(sequelize, Sequelize);
const Author = require("./author")(sequelize, Sequelize);
const AuthorFilm = require("./authorFilm")(sequelize, Sequelize);
const FilmView = require("./film_view")(sequelize, Sequelize);

Category.hasMany(Film);
Film.belongsTo(Category);
Film.hasMany(Comment);
Comment.belongsTo(Film);

Film.belongsToMany(Genre, { through: FilmGenre });
Genre.belongsToMany(Film, { through: FilmGenre });
Film.belongsToMany(Country, { through: FilmCountry });
Country.belongsToMany(Film, { through: FilmCountry });
Film.belongsToMany(Actor, { through: ActorFilm });
Actor.belongsToMany(Film, { through: ActorFilm });
Author.belongsToMany(Film, { through: AuthorFilm });
Film.belongsToMany(Author, { through: AuthorFilm });

Film.hasMany(Series);
Series.belongsTo(Film);
Series.hasMany(Comment);
Comment.belongsTo(Series);

sequelize.sync();

module.exports = {
  Film,
  Genre,
  Category,
  FilmGenre,
  FilmCountry,
  AuthorFilm,
  ActorFilm,
  Comment,
  Series,
  Author,
  Actor,
  Country,
  User,
  FilmView,
};
