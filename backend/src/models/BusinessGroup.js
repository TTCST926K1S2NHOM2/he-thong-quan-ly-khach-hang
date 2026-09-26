const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BusinessGroup = sequelize.define(
  "BusinessGroup",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Tên nhóm nghiệp vụ không được để trống",
        },
      },
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "business_groups",
    timestamps: true,
  }
);

module.exports = BusinessGroup;