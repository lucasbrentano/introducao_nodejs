import Sequelize from 'sequelize'

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './tic.db'
});

sequelize.authenticate();

export const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

export async function createProduct(product) {
    try {
        const result = await Product.create(product);
        console.log(`Product ${result.name} created.`);
        return result;
    } catch (error) {
        console.log('Error creating Product', error);
        throw error;
    }
}

export async function findAllProducts() {
    try {
        const result = await Product.findAll();
        console.log('Products found successfully', result);
        return result;
    } catch (error) {
        console.log('Error finding products', error);
        throw error;
    }
}

export async function findProductById(id) {
    try {
        const result = await Product.findByPk(id);
        console.log('Product found successfully', result);
        return result;
    } catch (error) {
        console.log('Error finding product', error);
        throw error;
    }
}

export async function updateProduct(id, dataProduct) {
    try {
        const result = await Product.findByPk(id);
        if(result?.id) {
            for (const key in dataProduct) {
                if(key in result) {
                    result[key] = dataProduct[key];
                }
            }
            result.save();
            console.log('Product updated successfully', result);
        }
        return result;
    } catch (error) {
        console.log('Error updating product', error);
        throw error;
    }
}

export async function deleteProduct(id) {
    try {
        const result = await Product.destroy({ where: {id:id} });
        console.log('Product deleted successfully', result);
    } catch (error) {
        console.log('Error deleting product', error);
        throw error;
    }
}