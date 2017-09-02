module.exports = (sequelize,DataTypes) => {
    var Item = sequelize.define('Item', {
        item_name: {
            type: DataTypes.STRING
        },
        quantity: {
            type: DataTypes.INTEGER
        }

    })
    
    Item.associate = (models) => {
        Item.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    }

    return Item;
}