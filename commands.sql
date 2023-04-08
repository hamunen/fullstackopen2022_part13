CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer NOT NULL DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Gill Bates', 'microsoft.com', 'Hey guys whatsup', 6790);
INSERT INTO blogs (author, url, title, likes) VALUES ('Henri Hamunen', 'myspace.com/hackerman', 'My blog', 12);

select * from blogs;