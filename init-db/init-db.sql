INSERT INTO "User" ("uuid", "firstName", "lastName", "email", "password", "avatarType")
VALUES ('dacdfcb2-b9f9-4bb1-a61c-9f41637d96c8',
        'Admin',
        'Istrator',
        'admin@tracklab.com',
        '$2b$10$VmeNNuedxhMVp3joJ43D4.D7zyfNiGpBaQ6GXoCoXwjxdIIZayfoS',
        'png'),
       ('40ffd4b2-68a4-4309-9610-1c6b4e554d96',
        'Jane',
        'Doe',
        'project@tracklab.com',
        '$2b$10$VmeNNuedxhMVp3joJ43D4.D7zyfNiGpBaQ6GXoCoXwjxdIIZayfoS',
        null),
       ('715d2bf3-a1f4-4332-8804-2f313e3dc1a9',
        'John',
        'Doe',
        'review@tracklab.com',
        '$2b$10$VmeNNuedxhMVp3joJ43D4.D7zyfNiGpBaQ6GXoCoXwjxdIIZayfoS',
        null);

INSERT INTO "CollectionItem" ("uuid", "title", "description", "url", "userId")
VALUES ('361efb7a-5bbf-4d4e-b13f-14720925cb4a',
        'Test Title',
        'Test Description',
        'analytics/driver-input?config=JTdCJTIyeWVhciUyMiUzQSUyMjIwMjUlMjIlMkMlMjJldmVudCUyMiUzQSU3QiUyMnJvdW5kTnVtYmVyJTIyJTNBMSUyQyUyMmNvdW50cnklMjIlM0ElMjJBdXN0cmFsaWElMjIlMkMlMjJsb2NhdGlvbiUyMiUzQSUyMk1lbGJvdXJuZSUyMiUyQyUyMm9mZmljaWFsTmFtZSUyMiUzQSUyMkZPUk1VTEElMjAxJTIwTE9VSVMlMjBWVUlUVE9OJTIwQVVTVFJBTElBTiUyMEdSQU5EJTIwUFJJWCUyMDIwMjUlMjIlMkMlMjJuYW1lJTIyJTNBJTIyQXVzdHJhbGlhbiUyMEdyYW5kJTIwUHJpeCUyMiUyQyUyMmRhdGUlMjIlM0ElMjIyMDI1LTAzLTE2VDAwJTNBMDAlM0EwMCUyMiUyQyUyMmZvcm1hdCUyMiUzQSUyMmNvbnZlbnRpb25hbCUyMiUyQyUyMmYxQXBpU3VwcG9ydCUyMiUzQXRydWUlMkMlMjJzZXNzaW9uSW5mb3MlMjIlM0ElNUIlN0IlMjJuYW1lJTIyJTNBJTIyUmFjZSUyMiUyQyUyMmRhdGUlMjIlM0ElMjIyMDI1LTAzLTE2VDE1JTNBMDAlM0EwMCUyQjExJTNBMDAlMjIlN0QlMkMlN0IlMjJuYW1lJTIyJTNBJTIyUXVhbGlmeWluZyUyMiUyQyUyMmRhdGUlMjIlM0ElMjIyMDI1LTAzLTE1VDE2JTNBMDAlM0EwMCUyQjExJTNBMDAlMjIlN0QlMkMlN0IlMjJuYW1lJTIyJTNBJTIyUHJhY3RpY2UlMjAzJTIyJTJDJTIyZGF0ZSUyMiUzQSUyMjIwMjUtMDMtMTVUMTIlM0EzMCUzQTAwJTJCMTElM0EwMCUyMiU3RCUyQyU3QiUyMm5hbWUlMjIlM0ElMjJQcmFjdGljZSUyMDIlMjIlMkMlMjJkYXRlJTIyJTNBJTIyMjAyNS0wMy0xNFQxNiUzQTAwJTNBMDAlMkIxMSUzQTAwJTIyJTdEJTJDJTdCJTIybmFtZSUyMiUzQSUyMlByYWN0aWNlJTIwMSUyMiUyQyUyMmRhdGUlMjIlM0ElMjIyMDI1LTAzLTE0VDEyJTNBMzAlM0EwMCUyQjExJTNBMDAlMjIlN0QlNUQlN0QlMkMlMjJzZXNzaW9uJTIyJTNBJTIyUmFjZSUyMiUyQyUyMmRyaXZlcnMlMjIlM0ElNUIlMjJOT1IlMjIlMkMlMjJWRVIlMjIlNUQlN0Q=',
        'dacdfcb2-b9f9-4bb1-a61c-9f41637d96c8');
