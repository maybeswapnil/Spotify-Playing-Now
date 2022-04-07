
# Spotify-Playing-Now

Reference Application to connect to spotify API to request currently playing songs.

**Prerequisites**
```
This guide assumes that you have created an app following the app settings guide.
```
**Source Code**
```
You can find an example app implementing Client Credentials flow on 
GitHub in the web-api-auth-examples repository.
```
**Request authorization**
```
The first step is to send a POST request to the 
/api/token endpoint of the Spotify OAuth 2.0 Service with the 
following parameters encoded in application/x-www-form-urlencoded:

REQUEST BODY PARAMETER	VALUE
grant_type	Required
Set it to client_credentials.
The headers of the request must contain the following parameters:
HEADER PARAMETER	VALUE
Authorization	Required
Base 64 encoded string that contains the client ID and client secret key. 
The field must have the format: 
Authorization: Basic <base64 encoded client_id:client_secret>
Content-Type	Required
Set to application/x-www-form-urlencoded.
```
### Request Access Token

If the user accepted your request, then your app is ready to exchange the authorization code for an Access Token. It can do this by making a  `POST`  request to the  `/api/token`  endpoint.

The body of this  `POST`  request must contain the following parameters encoded in  `application/x-www-form-urlencoded`:

**REQUEST BODY PARAMETER**
```
grant_type _Required_  
This field must contain the value  `"authorization_code"`.
```
```
code _Required_  
The authorization code returned from the previous request.
```
```
redirect_uri _Required_  
This parameter is used for validation only (there is no actual redirection). 
The value of this parameter must exactly match the value 
of `redirect_uri` supplied when requesting the authorization code.
```

If you are implementing the PKCE extension, these additional parameters must be included as well:

**REQUEST BODY PARAMETER**

```
client_id _Required._  
The client ID for your app, available from the developer dashboard.
```
```
code_verifier _Required._  
The value of this parameter must match the value of the  `code_verifier` 
that your app generated in the previous step.
```
The request must include the following HTTP headers:

**HEADER PARAMETER**
```
Authorization _Required_  
Base 64 encoded string that contains the client ID and client secret key. 
The field must have the format:
`Authorization: Basic <base64 encoded client_id:client_secret>`
```
```
Content-Type _Required_  
Set to  `application/x-www-form-urlencoded`.
```
<br/>
![image](https://user-images.githubusercontent.com/66242615/161763646-6be45b80-0c4f-47d2-8bb9-0af38a2cbcf9.png)

##How to create a Spotify refresh token the easy way

In this guide I will explain how to manually generate a Spotify refresh token then use that to programmatically create an access token when needed.

My use case was for my  [wwoz_to_spotify](https://github.com/benwiz/wwoz_to_spotify)  project in which I have a long running cronjob that needs to update a Spotify playlist. Since the job runs in the background I needed a way to avoid the Spotify login pop-up during the authorization flow. The solution is to manually generate a Spotify refresh token then use that to create an access token when needed.

## Step 1: Get your Spotify  `client_id`  and  `client_secret`

Visit your  [Spotify developers dashboard](https://developer.spotify.com/dashboard/applications)  then select or create your app. Note down your  _Client ID_,  _Client Secret_, and  _Redirect URI_  in a convenient location to use in Step 2.

## Step 2: Get your access code

Visit the following URL after replacing  `$CLIENT_ID`,  `$SCOPE`, and  `$REDIRECT_URI`  with the information you noted in Step 1. Make sure the  `$REDIRECT_URI`  is URL encoded.

```
https://accounts.spotify.com/authorize?response_type=code&client_id=$CLIENT_ID&scope=$SCOPE&redirect_uri=$REDIRECT_URI

```

My url looked like this

```
https://accounts.spotify.com/authorize?response_type=code&client_id=$CLIENT_ID&scope=playlist-modify-private&redirect_uri=https%3A%2F%2Fbenwiz.io

```

## Step 3: Get  `code`  from the redirect URL

I was redirected to the following URL because my redirect URI was set to  _https://benwiz.io_. In place of  `$CODE`  there was a very long string of characters. Copy that string and note it down for use in Step 4.

```
https://benwiz.io/?code=$CODE

```

## Step 4: Get the refresh token

Running the following CURL command will result in a JSON string that contains the refresh token, in addition to other useful data. Again, either replace or export the following variables in your shell  `$CILENT_ID`,  `$CLIENT_SECRET`,  `$CODE`, and  `$REDIRECT_URI`.

```
curl -d client_id=$CLIENT_ID -d client_secret=$CLIENT_SECRET -d grant_type=authorization_code -d code=$CODE -d redirect_uri=$REDIRECT_URI https://accounts.spotify.com/api/token

```

The result will be a JSON string similar to the following. Take the  `refresh_token`  and save that in a safe, private place. This token will last for a very long time and can be used to generate a fresh  `access_token`  whenever it is needed.

```
{
    "access_token": "$ACCESS_TOKEN",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "$REFRESH_TOKEN",
    "scope": "playlist-modify-private"
}

```
