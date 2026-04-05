# OpenAPI definition


**简介**:OpenAPI definition


**HOST**:http://127.0.0.1:8080


**联系人**:


**Version**:v0


**接口路径**:/v3/api-docs


[TOC]






# 用户认证


## 发送注册验证码


**接口地址**:`/login/sendRegisterCode`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>向用户邮箱发送注册验证码</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|email|用户邮箱|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RObject|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


## 发送登录验证码


**接口地址**:`/login/sendLoginCode`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>向用户邮箱发送登录验证码</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|email|用户邮箱|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RObject|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


## 用户注册


**接口地址**:`/login/reg`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>用户注册接口，需要提供用户名、邮箱、密码和验证码</p>



**请求示例**:


```javascript
{
  "id": 0,
  "username": "",
  "email": "",
  "password": "",
  "status": 0,
  "code": "",
  "createdAt": "",
  "updatedAt": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|user|用户信息，包含用户名、邮箱、密码和验证码|body|true|User|User|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;username|||false|string||
|&emsp;&emsp;email|||false|string||
|&emsp;&emsp;password|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;code|||false|string||
|&emsp;&emsp;createdAt|||false|string(date-time)||
|&emsp;&emsp;updatedAt|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RObject|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


## 用户登录


**接口地址**:`/login/login`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>用户登录接口，支持用户名或邮箱登录，邮箱登录需要验证码</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|usernameOrEmail|用户名或邮箱|query|true|string||
|password|密码|query|true|string||
|code|验证码（邮箱登录时必填，用户名登录时可选）|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RObject|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```