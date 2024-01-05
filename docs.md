[kinde-angular](README.md) / KindeAngularService

# Class: KindeAngularService

## Table of contents

### Properties

- [accessToken$](docs.md#accessToken)
- [isAuthenticated$](docs.md#isAuthenticated)
- [isLoading$](docs.md#isLoading)
- [user$](docs.md#user$)

### Methods

- [getAccessToken](docs.md#getaccesstoken)
- [getFeatureFlag](docs.md#getfeatureflag)
- [getFeatureFlagEnabled](docs.md#getfeatureflagenabled)
- [handleCallback](docs.md#handlecallback)
- [login](docs.md#login)
- [logout](docs.md#logout)
- [shouldHandleCallback](docs.md#shouldhandlecallback)

## Properties

### accessToken$

• **accessToken$**: `Observable<null | string>`

#### Defined in

[projects/kinde-angular/src/lib/kinde-angular.service.ts:16](https://github.com/luukhaijes/kinde-angular/blob/60ffe1f/projects/kinde-angular/src/lib/kinde-angular.service.ts#L16)

___

### isAuthenticated$

• **isAuthenticated$**: `Observable<boolean>`

#### Defined in

[projects/kinde-angular/src/lib/kinde-angular.service.ts:14](https://github.com/luukhaijes/kinde-angular/blob/60ffe1f/projects/kinde-angular/src/lib/kinde-angular.service.ts#L14)

___

### isLoading$

• **isLoading$**: `Observable<boolean>`

#### Defined in

[projects/kinde-angular/src/lib/kinde-angular.service.ts:15](https://github.com/luukhaijes/kinde-angular/blob/60ffe1f/projects/kinde-angular/src/lib/kinde-angular.service.ts#L15)
___

### user$

• **user$**: `Observable<null | UserType>`

#### Defined in

[projects/kinde-angular/src/lib/kinde-angular.service.ts:13](https://github.com/luukhaijes/kinde-angular/blob/60ffe1f/projects/kinde-angular/src/lib/kinde-angular.service.ts#L13)

## Methods

### getAccessToken

▸ **getAccessToken**(): `Promise<string>`

#### Returns

`Observable<string>`

#### Defined in

[projects/kinde-angular/src/lib/kinde-angular.service.ts:36](https://github.com/luukhaijes/kinde-angular/blob/60ffe1f/projects/kinde-angular/src/lib/kinde-angular.service.ts#L36)

___

### getFeatureFlag

▸ **getFeatureFlag**(`code`, `defaultValue?`, `flagType?`): `Promise<GetFlagType>`

#### Parameters

| Name            | Type                              |
|:----------------|:----------------------------------|
| `code`          | `string`                          |
| `defaultValue?` | `string` \| `number` \| `boolean` |
| `flagType?`     | ``"b"`` \| ``"i"`` \| ``"s"``     |

#### Returns

`Promise<GetFlagType>`

#### Defined in

[projects/kinde-angular/src/lib/kinde-angular.service.ts:40](https://github.com/luukhaijes/kinde-angular/blob/60ffe1f/projects/kinde-angular/src/lib/kinde-angular.service.ts#L40)

___

### getFeatureFlagEnabled

▸ **getFeatureFlagEnabled**(`code`, `defaultValue?`): `Promise<boolean>`

#### Parameters

| Name            | Type      |
|:----------------|:----------|
| `code`          | `string`  |
| `defaultValue?` | `boolean` |

#### Returns

`Promise<boolean>`

#### Defined in

[projects/kinde-angular/src/lib/kinde-angular.service.ts:44](https://github.com/luukhaijes/kinde-angular/blob/60ffe1f/projects/kinde-angular/src/lib/kinde-angular.service.ts#L44)

___

### handleCallback

▸ **handleCallback**(): `Promise<void>`

#### Returns

`Promise<void>`

#### Defined in

[projects/kinde-angular/src/lib/kinde-angular.service.ts:67](https://github.com/luukhaijes/kinde-angular/blob/60ffe1f/projects/kinde-angular/src/lib/kinde-angular.service.ts#L67)

___

### login

▸ **login**(): `Promise<void>`

#### Returns

`Promise<void>`

#### Defined in

[projects/kinde-angular/src/lib/kinde-angular.service.ts:49](https://github.com/luukhaijes/kinde-angular/blob/60ffe1f/projects/kinde-angular/src/lib/kinde-angular.service.ts#L49)

___

### logout

▸ **logout**(): `Promise<void>`

#### Returns

`Promise<void>`

#### Defined in

[projects/kinde-angular/src/lib/kinde-angular.service.ts:54](https://github.com/luukhaijes/kinde-angular/blob/60ffe1f/projects/kinde-angular/src/lib/kinde-angular.service.ts#L54)

___

### shouldHandleCallback

▸ **shouldHandleCallback**(): `Observable<boolean>`

#### Returns

`Observable<boolean>`

#### Defined in

[projects/kinde-angular/src/lib/kinde-angular.service.ts:59](https://github.com/luukhaijes/kinde-angular/blob/60ffe1f/projects/kinde-angular/src/lib/kinde-angular.service.ts#L59)
