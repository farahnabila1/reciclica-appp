import { Observable, throwError } from "rxjs";
import { LoginEffects } from "./login.effects"
import { Action, Store, StoreModule } from "@ngrx/store";
import { login, loginFail, loginSuccess, recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from "src/store/login/login.actions";
import { of } from "rxjs";
import { TestBed } from "@angular/core/testing";
import { EffectsModule } from "@ngrx/effects";
import { provideMockActions } from "@ngrx/effects/testing";
import { AuthService } from "src/app/services/auth/auth.service";
import { User } from "src/app/modul/user/User";

describe('Login effects', () =>{

  let effects: LoginEffects;
  let actions$: Observable<Action>;
  let error = {error: 'error'};
  let user = new User();
  user.id = "anyUserId";


  let authServicMock = {
    recoverEmailPassword: (email: string) => {
      if (email == "error@email.com"){
        return throwError(error);
      }
      return of({});
    },
    login: (email: string, password: string) => {
      if (email == "error@email.com"){
        return throwError(error);
      }
      return of(user);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot({}),
        EffectsModule.forFeature([
          LoginEffects
        ])
      ],
      providers: [
        provideMockActions(() => actions$)
      ]
    }).overrideProvider(AuthService, {useValue: authServicMock});

    effects = TestBed.get(LoginEffects);
  })

  it('should recover password with exiting email return success', (done) => {
    actions$ = of(recoverPassword({email: "any@email.com"}));

    effects.recoverPassword$.subscribe(newAction => {
      expect(newAction).toEqual(recoverPasswordSuccess());
      done();
    });
  })

    it('should recover password with not exiting email retun an error', (done) => {
      actions$ = of(recoverPassword({email: "error@email.com"}));

      effects.recoverPassword$.subscribe(newActions => {
        expect(newActions).toEqual(recoverPasswordFail({error}));
        done();
      })

    })

    it('should login with valid credentials return success', (done) => {
      actions$ = of(login({email: "valid@email.com", password: "anyPassword"}));

      effects.login$.subscribe(newActions => {
        expect(newActions).toEqual(loginSuccess({user}));
        done();
      })
    })

    it('should login with invalid credentials return an error', (done) => {
      actions$ = of(login({email: "error@email.com", password: "anyPassword"}));

      effects.login$.subscribe(newActions => {
        expect(newActions).toEqual(loginFail({error}));
        done();
      })


    })
  })
