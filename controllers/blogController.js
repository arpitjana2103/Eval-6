const {Blog} = require('../model/bolgsModel.js');

class BlogFeatures {
    constructor(Query, reqQuery) {
        this.Query = Query;
        this.reqQuery = reqQuery;
    }

    filter() {
        let reqQueryObj = [...this.reqQuery];

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
}

const getAllBlogs = async function (req, res) {
    try {
        const blogs = new BlogFeatures(Blog.find(), req.query);

        blogs = blogs.filter().sort();

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

module.exports = {getAllBlogs, createBlog, updateBlog, deleteBlog};