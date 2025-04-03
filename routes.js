import fs from 'fs';

export default function routes(req, res, data) {
    res.setHeader('Content-Type', 'application/json', 'utf-8');

    if (req.method === 'GET' && req.url === '/') {
        const { content } = data;

        res.statusCode = 200;

        const response = {
            message: content
        };

        res.end(JSON.stringify(response));

        return;
    }

    if (req.method === 'PUT' && req.url === '/files') {
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const file = JSON.parse(body);

            res.statusCode = 400;

            if (!file?.name) {
                const response = {
                    error: {
                        message: `No name found, please provide the name for creation.`,
                    }
                };
                res.end(JSON.stringify(response));

                return;
            }

            fs.writeFile(`${file.name}.txt`, file?.content ?? '', 'utf-8', (err) => {
                if (err) {
                    console.log('Error creating file ', err);

                    res.statusCode = 500;

                    const response = {
                        error: {
                            message: `Error creating file ${file.name}`
                        }
                    };

                    res.end(JSON.stringify(response));

                    return;
                }

                res.statusCode = 201;

                const response = {
                    message: `File ${file.name} was created successfully`
                };

                res.end(JSON.stringify(response));

                return;
            });
            return;
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

            return;
        });
        return;
    };

    if (req.method === 'PATCH' && req.url === '/files') {
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const file = JSON.parse(body);

            res.statusCode = 400;

            if (!file?.name) {
                const response = {
                    error: {
                        message: `No name found, please provide the name for update.`,
                    }
                };
                res.end(JSON.stringify(response));

                return;
            }

            if (!file?.content) {
                const response = {
                    error: {
                        message: `No content found, please update the content.`,
                    }
                };
                res.end(JSON.stringify(response));

                return;
            }

            fs.access(`${file.name}.txt`, fs.constants.W_OK, (err) => {
                if (err) {
                    console.log('Error accessing file ', err);

                    res.statusCode = err.code === 'ENOENT' ? 404 : 403;

                    const response = {
                        error: {
                            message: `Error accessing file ${file.name}`
                        }
                    };

                    res.end(JSON.stringify(response));

                    return;
                }

                fs.appendFile(`${file.name}.txt`, `\n${file.content}`, 'utf-8', (err) => {
                    if (err) {
                        console.log('Error updating file ', err);

                        res.statusCode = 500;

                        const response = {
                            error: {
                                message: `Error updating file ${file.name}`
                            }
                        };

                        res.end(JSON.stringify(response));

                        return;
                    }

                    res.statusCode = 200;

                    const response = {
                        message: `File ${file.name} was updated successfully`
                    };

                    res.end(JSON.stringify(response));

                    return;
                });
            });
            return;
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

            return;
        });
        return;
    };

    if (req.method === 'DELETE' && req.url === '/files') {
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const file = JSON.parse(body);

            res.statusCode = 400;

            if (!file?.name) {
                const response = {
                    error: {
                        message: `No name found, please provide the name for delete.`,
                    }
                };
                res.end(JSON.stringify(response));

                return;
            }

            fs.access(`${file.name}.txt`, fs.constants.W_OK, (err) => {
                if (err) {
                    console.log('Error accessing file ', err);

                    res.statusCode = err.code === 'ENOENT' ? 404 : 403;

                    const response = {
                        error: {
                            message: `Error accessing file ${file.name}`
                        }
                    };

                    res.end(JSON.stringify(response));

                    return;
                }

                fs.rm(`${file.name}.txt`, (err) => {
                    if (err) {
                        console.log('Error deleting file ', err);

                        res.statusCode = 500;

                        const response = {
                            error: {
                                message: `Error deleting file ${file.name}`
                            }
                        };

                        res.end(JSON.stringify(response));

                        return;
                    }

                    res.statusCode = 200;

                    const response = {
                        message: `File ${file.name} was deleted successfully`
                    };

                    res.end(JSON.stringify(response));

                    return;
                });
            });
            return;
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

            return;
        });
        return;
    };

    res.statusCode = 404;

    const response = {
        error: {
            message: 'Route not found',
            url: req.url
        }
    };

    res.end(JSON.stringify(response));
}