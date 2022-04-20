
//graphql.module.spec.ts is the unit testing file for the GraphQL module.
import { async } from '@angular/core/testing';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { GraphQLModule } from './graphql.module';
describe('GraphQLModule', () => {
  let obj;

  beforeEach(() => {
    obj = new GraphQLModule();
  });

});
