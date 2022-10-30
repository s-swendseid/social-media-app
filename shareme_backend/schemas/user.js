// schema of our user
export default {
    name: "user",
    title: "User", // model
    type: "document", //each user is a document
    // fields the document will have
    fields: [
        {
            name: "userName",
            title: "UserName",
            type: "string",
        },
        {
            name: "image",
            title: "Image",
            type: "string",
        }
    ]
};