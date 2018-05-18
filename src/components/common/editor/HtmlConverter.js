import React from "react";
import Html from "slate-html-serializer";
// Refactor block tags into a dictionary for cleanliness.
const BLOCK_TAGS = {
    p: "paragraph",
    blockquote: "quote",
    pre: "code",
    img: "image"
};

const MARK_TAGS = {
    em: "italic",
    strong: "bold",
    u: "underline"
};

const rules = [
    {
        // Switch deserialize to handle more blocks...
        deserialize(el, next) {
            const type = BLOCK_TAGS[el.tagName.toLowerCase()];
            if (type) {
                if (type == "image") {
                    return {
                        object: "block",
                        type: "image",
                        isVoid: true,
                        data: { src: el.src }
                    };
                }

                return {
                    object: "block",
                    type: type,
                    nodes: next(el.childNodes)
                };
            }
        },
        // Switch serialize to handle more blocks...
        serialize(obj, children) {
            if (obj.object == "block") {
                switch (obj.type) {
                    case "image": {
                        console.log(obj);
                        console.log(children);
                        const src = obj.data.get("src");
                        const style = { display: "block", width: "100%" };
                        return <img src={src} style={style} />;
                    }
                    case "paragraph":
                        return <p>{children}</p>;
                    case "quote":
                        return <blockquote>{children}</blockquote>;
                    case "code":
                        return (
                            <pre>
                                <code>{children}</code>
                            </pre>
                        );
                }
            }
        }
    },
    {
        deserialize(el, next) {
            const type = MARK_TAGS[el.tagName.toLowerCase()];
            if (type) {
                return {
                    object: "mark",
                    type: type,
                    nodes: next(el.childNodes)
                };
            }
        },
        serialize(obj, children) {
            if (obj.object == "mark") {
                switch (obj.type) {
                    case "bold":
                        return <strong>{children}</strong>;
                    case "italic":
                        return <em>{children}</em>;
                    case "underline":
                        return <u>{children}</u>;
                }
            }
        }
    }
];

export default new Html({ rules });
