import { trigger, transition, style, animate } from '@angular/animations';

export const authAnimations = [
     trigger('slideInLeft', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(-80px)' }),
      animate('600ms cubic-bezier(.68,-0.55,.27,1.55)', style({ opacity: 1, transform: 'translateX(0)' }))
    ])
  ]),
  trigger('slideInRight', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(80px)' }),
      animate('600ms cubic-bezier(.68,-0.55,.27,1.55)', style({ opacity: 1, transform: 'translateX(0)' }))
    ])
  ])
];
