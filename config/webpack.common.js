/**
 * @file webpack common setting
 * @author david wang 
 */
module.exports = {
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    }
};