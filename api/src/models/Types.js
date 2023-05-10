const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('types', {
    // lo comentare porque no es necesario sequelize ya crea id
    // id: {
    //   type: DataTypes.INTEGER,
    //   primarykey: true,
    //   allowNull: false
    // },
    name: {
    type: DataTypes.STRING,
    //allowNull: false,
    unique: true,
        }
    })
}