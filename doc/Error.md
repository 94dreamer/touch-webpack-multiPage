1. 编译css时提示 window is not defined

//new ExtractTextPlugin("[name][id].css")打错了


2. ExtractTextPlugin弹出的文件找不到

In all my wisdom I did not realize that the dev-server did not write files to disk. The setup is working when I do not run the dev-server

3.cross-env不管用 却export NODE_ENV=development可以

cross-env NODE_ENV=online && webpack 去掉&& 改成 cross-env NODE_ENV=online && webpack。