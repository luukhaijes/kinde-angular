# KindeAngular

Kinde integration for Angular

This package is in **beta**, for issues and feature requests please use [GitHub Issues](https://github.com/luukhaijes/kinde-angular/issues)


## Quick setup

```bash
npm i kinde-angular
```

import module to your app module

```typescript
import { KindeAngularModule } from 'kinde-angular';
```

Add KindeModule to your imports

```typescript
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    KindeAngularModule.forRoot({
      clientId: 'client_id_here',
      authDomain: 'https://domain.kinde.com',
      redirectURL: 'http://localhost:4200/',
      logoutRedirectURL: 'http://localhost:4200/',
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

Add KindeService to your component via contructor or Inject method

```typescript
constructor(private authService: KindeAngularService) {}
```

Or

```typescript
const authService = inject(KindeAngularService);
```

### Protect routes

Use feature guard

```typescript
[{
  path: 'feature',
  component: FeatureComponent,
  canActivate: [featureFlagGuard('has_feature')]
}]
```

Use canActivate auth guard

```typescript
[{
  path: 'route',
  component: AComponent,
  canActivate: [canActivateAuthGuard]
}]
```

You can also read some more information [here](docs.md)

## Roadmap

- [ ] More unit tests
- [ ] More documentation
- [ ] Interceptor
  - [ ] basic interceptor
  - [ ] with pattern matching
- [ ] Support analogjs
- [x] feature flag guard
- [ ] feature flag directive
- [ ] ng schematic
