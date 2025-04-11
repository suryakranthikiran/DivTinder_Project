# DevTinder API's

## authRouter

    - POST /signup
    - POST /login
    - POST /logout

## profileRouter

    - GET /profile/view
    - PATCH /profile/edit
    - PATCH /profile/password /forgot password API

## connectionRequestRouter

    - POST /request/send/:status/:userId (status : ignore, intrested)
    - POST /request/review/:status/:requestId ( status : accepted, rejected)

## userRouter

    -GET /user/connections
    -GET //user/requests/received
    -GET /user/feed - Gets you the profile of other users on platform

    -Pagination
        /feed?page=1&limit=10 =>.skip(0) & .limit(10)=> first 10 users it will give

        /feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)=> it will skip first 10 users and next 10 users will be display

        /feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)=> it will skip first 10 users and next 10 users will be display

        skip = >(page-1)*limit
