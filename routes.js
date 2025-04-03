import fs from 'fs';
import { sequelize, createProduct, findAllProducts, findProductById, updateProduct, deleteProduct } from './models.js'

export default async function routes(req, res, data) {
    res.setHeader('price-Type', 'application/json', 'utf-8');

    if (req.method === 'GET' && req.url === '/') {
        const { price } = data;

        res.statusCode = 200;

        const response = {
            message: price
        };

        res.end(JSON.stringify(response));

        return;
    }

    if (req.method === 'POST' && req.url === '/products') {
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', async() => {
            const product = JSON.parse(body);

            res.statusCode = 400;

            if (!product?.name) {
                const response = {
                    error: {
                        message: `No name found, please provide the name for creation.`,
                    }
                };
                res.end(JSON.stringify(response));

                return;
            }

            if (!product?.price) {
                const response = {
                    error: {
                        message: `No price found, please provide the price for creation.`,
                    }
                };
                res.end(JSON.stringify(response));

                return;
            }

            try {
                const response = await createProduct(product);

                res.statusCode = 201;

                res.end(JSON.stringify(response));

                //return;
            } catch (error) {
                console.log('Error creating product ', error);

                res.statusCode = 500;

                const response = {
                    error: {
                        message: `Error creating product ${product.name}`
                    }
                };

                res.end(JSON.stringify(response));

                //return;
            }
        });

        req.on('error', (err) => {
            console.log('Error processing request', err);

            res.statusCode = 400;

            const response = {
                error: {
                    message: 'Error processing request'
                }
            };

            res.end(JSON.stringify(response));

            //return;
        });
        return;
    }

    if (req.method === 'PATCH' && req.url.split('/')[1] === 'products' && !isNaN(req.url.split('/')[2])) {
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', async() => {
            const product = JSON.parse(body);

            res.statusCode = 400;

            if (!product?.name && !product?.price) {
                const response = {
                    error: {
                        message: `No attribute found, please provide an attribute for update.`,
                    }
                };
                res.end(JSON.stringify(response));

                return;
            }

            const id = req.url.split('/')[2];

            try {
                const response = await updateProduct(id, product);

                res.statusCode = 200;

                if(!response) {
                    res.statusCode = 404;
                }

                res.end(JSON.stringify(response));

                //return;

            } catch (error) {
                console.log('Error updating product ', err);

                res.statusCode = 500;

                const response = {
                    error: {
                        message: `Error updating product ${product.name}`
                    }
                };

                res.end(JSON.stringify(response));

                //return;
            }
        });

        req.on('error', (err) => {
            console.log('Error processing request', err);

            res.statusCode = 400;

            const response = {
                error: {
                    message: 'Error processing request'
                }
            };

            res.end(JSON.stringify(response));

            //return;
        });
        return;
    }

    if (req.method === 'DELETE' && req.url.split('/')[1] === 'products' && !isNaN(req.url.split('/')[2])) {
        const id = req.url.split('/')[2];

        try {
            const found = await deleteProduct(id);

            res.statusCode = 204;

            if(!found) {
                res.statusCode = 404;
            }

            res.end();

            return;
        } catch (error) {
            console.log('Error deleting product ', error);

            res.statusCode = 500;

            const response = {
                error: {
                    message: `Error deleting product ${id}`
                }
            };

            res.end(JSON.stringify(response));

            return;
        }
    }

    if (req.method === 'GET' && req.url.split('/')[1] === 'products' && !isNaN(req.url.split('/')[2])) {
        const id = req.url.split('/')[2];

        try {
            const response = await findProductById(id);

            res.statusCode = 200;

            if(!response) {
                res.statusCode = 404;
            }

            res.end(JSON.stringify(response));

            return;
        } catch (error) {
            console.log('Error finding product ', error);

            res.statusCode = 500;

            const response = {
                error: {
                    message: `Error finding product ${id}`
                }
            };

            res.end(JSON.stringify(response));

            return;
        }
    }

    if (req.method === 'GET' && req.url === '/products') {
        try {
            const response = await findAllProducts();

            res.statusCode = 200;

            res.end(JSON.stringify(response));

            return;
        } catch (error) {
            console.log('Error finding products ', error);

            res.statusCode = 500;

            const response = {
                error: {
                    message: `Error finding products`
                }
            };

            res.end(JSON.stringify(response));

            return;
        }
    }

    res.statusCode = 404;

    const response = {
        error: {
            message: 'Route not found',
            url: req.url
        }
    };

    res.end(JSON.stringify(response));
}