import {Test, Expect} from 'alsatian'

export class InitialTest {

	@Test('first test')
	public FirstTest() {
		Expect(1+1).toBe(2);
	}

}