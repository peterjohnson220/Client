import { FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import { UserApiService } from 'libs/data/payfactors-api';

// List of popular blacklisted personal email domains from https://github.com/mailcheck/mailcheck/wiki/List-of-Popular-Domains
const BLACKLISTED_DOMAINS: Set<string> = new Set([
  /* Default domains included */
  'aol.com', 'att.net', 'comcast.net', 'facebook.com', 'gmail.com', 'gmx.com', 'googlemail.com',
  'google.com', 'hotmail.com', 'hotmail.co.uk', 'mac.com', 'me.com', 'mail.com', 'msn.com',
  'live.com', 'sbcglobal.net', 'verizon.net', 'yahoo.com', 'yahoo.co.uk',

  /* Other global domains */
  'email.com', 'fastmail.fm', 'games.com' /* AOL */, 'gmx.net', 'hush.com', 'hushmail.com', 'icloud.com',
  'iname.com', 'inbox.com', 'lavabit.com', 'love.com' /* AOL */, 'outlook.com', 'pobox.com', 'protonmail.com',
  'rocketmail.com' /* Yahoo */, 'safe-mail.net', 'wow.com' /* AOL */, 'ygm.com' /* AOL */,
  'ymail.com' /* Yahoo */, 'zoho.com', 'yandex.com',

  /* United States ISP domains */
  'bellsouth.net', 'charter.net', 'cox.net', 'earthlink.net', 'juno.com',

  /* British ISP domains */
  'btinternet.com', 'virginmedia.com', 'blueyonder.co.uk', 'freeserve.co.uk', 'live.co.uk',
  'ntlworld.com', 'o2.co.uk', 'orange.net', 'sky.com', 'talktalk.co.uk', 'tiscali.co.uk',
  'virgin.net', 'wanadoo.co.uk', 'bt.com',

  /* Domains used in Asia */
  'sina.com', 'sina.cn', 'qq.com', 'naver.com', 'hanmail.net', 'daum.net', 'nate.com', 'yahoo.co.jp', 'yahoo.co.kr',
  'yahoo.co.id', 'yahoo.co.in', 'yahoo.com.sg', 'yahoo.com.ph', '163.com', '126.com', 'aliyun.com', 'foxmail.com',

  /* French ISP domains */
  'hotmail.fr', 'live.fr', 'laposte.net', 'yahoo.fr', 'wanadoo.fr', 'orange.fr', 'gmx.fr', 'sfr.fr', 'neuf.fr', 'free.fr',

  /* German ISP domains */
  'gmx.de', 'hotmail.de', 'live.de', 'online.de', 't-online.de' /* T-Mobile */, 'web.de', 'yahoo.de',

  /* Italian ISP domains */
  'libero.it', 'virgilio.it', 'hotmail.it', 'aol.it', 'tiscali.it', 'alice.it', 'live.it', 'yahoo.it',
  'email.it', 'tin.it', 'poste.it', 'teletu.it',

  /* Russian ISP domains */
  'mail.ru', 'rambler.ru', 'yandex.ru', 'ya.ru', 'list.ru',

  /* Belgian ISP domains */
  'hotmail.be', 'live.be', 'skynet.be', 'voo.be', 'tvcablenet.be', 'telenet.be',

  /* Argentinian ISP domains */
  'hotmail.com.ar', 'live.com.ar', 'yahoo.com.ar', 'fibertel.com.ar', 'speedy.com.ar', 'arnet.com.ar',

  /* Domains used in Mexico */
  'yahoo.com.mx', 'live.com.mx', 'hotmail.es', 'hotmail.com.mx', 'prodigy.net.mx',

  /* Domains used in Brazil */
  'yahoo.com.br', 'hotmail.com.br', 'outlook.com.br', 'uol.com.br', 'bol.com.br', 'terra.com.br', 'ig.com.br',
  'itelefonica.com.br', 'r7.com', 'zipmail.com.br', 'globo.com', 'globomail.com', 'oi.com.br'
]);

const EMAIL_VALIDATOR: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;
enum EmailValidatorGroup {
  Username = 1,
  Domain = 5
}

export class PfEmailValidators {

  static emailFormat(control: FormControl): ValidationErrors {
    return control.value && !EMAIL_VALIDATOR.test(control.value) ? { 'emailFormat': { valid: false } } : null;
  }

  static workEmail(control: FormControl): ValidationErrors {
    const matches = control.value.match(EMAIL_VALIDATOR);
    if (matches == null) {
      return { 'workEmail': { valid: false } };
    }
    const emailDomain: string = matches[EmailValidatorGroup.Domain];
    return BLACKLISTED_DOMAINS.has(emailDomain.toLowerCase()) ? { 'workEmail': { valid: false, domain: emailDomain } } : null;
  }
}

export class PfEmailTakenValidator {
  static createValidator(userApiService: UserApiService, originaValue = '') {
    return (control: AbstractControl) => {
      if (!control.dirty || control.value === '' || control.value === originaValue) {
        return new Promise(resolve => resolve(null));
      }

      return userApiService.emailExists(control.value)
        .map(exists => exists === true ? { emailTaken: true } : null);
    };
  }
}
