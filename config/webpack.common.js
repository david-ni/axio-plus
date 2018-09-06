/**
 * @file webpack common setting
 * @author david wang 
 */
module.exports = {
    resolve: {
        extensions: [ '.ts', '.tsx', ".js", ".json"]
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