const {Blog} = require('../model/bolgsModel.js');

class BlogFeatures {
    constructor(Query, reqQuery) {
        this.Query = Query;
        this.reqQuery = reqQuery;
    }

    filter() {
        let reqQueryObj = {...this.reqQuery};

        ['page', 'sort', 'limit', 'fields', 'order'].forEach(function (item) {
            delete reqQueryObj[item];
        });

        this.Query = this.Query.find(reqQueryObj);

        return this;
    }

    sort() {
        if (this.reqQuery.sort) {
            let sortBy = '';
            let sign = '';
            if (this.reqQuery.order && this.reqQuery.order === 'desc') {
                sign = '-';
            }

            this.Query = this.Query.sort(sign + sortBy);
        }

        return this;
    }

    search() {
        if (this.reqQuery.search) {
            const searchKeyword = this.reqQuery.search;
            this.Query = this.Query.find({
                title: {$regex: searchKeyword, $options: 'i'},
            });
        }
        return this;
    }
}

const getAllBlogs = async function (req, res) {
    try {
        let blogs = new BlogFeatures(Blog.find(), req.query);

        blogs = blogs.filter().sort().search();

        const docs = await blogs.Query;

        return res.status(200).json({
            status: 'success',
            data: {
                data: docs,
            },
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
};

const createBlog = async function (req, res) {
    try {
        const newBlog = await Blog.create(req.body);

        return res.status(201).json({
            status: 'success',
            message: 'Published Successfully',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
};

const updateBlog = async function (req, res) {
    try {
        const id = req.params.id;

        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body);
        return res.status(200).json({
            status: 'success',
            message: 'Updated Successfully',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
};

const deleteBlog = async function (req, res) {
    try {
        const id = req.params.id;

        await Blog.findByIdAndDelete(id);
        return res.status(204).json({
            status: 'success',
            message: 'Deleted Successfully',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
};

const addLike = async function (req, res) {
    try {
        const id = req.params.id;
        const blog = await Blog.findById(id);

        blog.likes++;
        await blog.save();

        return res.status(204).json({
            status: 'success',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
};

const addComment = async function (req, res) {
    try {
        const id = req.params.id;
        const blog = await Blog.findById(id);

        const comment = {
            username: req.user.name,
            comment: req.body.comment,
        };

        blog.comment.push(comment);
        await blog.save();

        return res.status(204).json({
            status: 'success',
            message: 'Comment Added Successfully',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
};

module.exports = {
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    addComment,
    addLike,
};
