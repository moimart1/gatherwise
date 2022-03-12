import * as ConsoleTransport from 'winston/lib/winston/transports/console';
import logger from '../../utils/logger';

describe('Utils logger', () => {
  it('Expect Nest format', async () => {
    const mockLog = jest.spyOn(ConsoleTransport.default.prototype, 'log');

    logger.log('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    function getMessage(obj) {
      return obj[Reflect.ownKeys(obj as any).find((key) => key.toString() === 'Symbol(message)')];
    }

    expect(mockLog).toHaveBeenCalledTimes(3);

    const formatedLog = getMessage(mockLog.mock.calls[0][0]);
    expect(formatedLog).toContain('[92m[NestWinston][39m [33mInfo[39m');
    expect(formatedLog).toContain('[92mInfo message[39m - {}');

    const formatedWarn = getMessage(mockLog.mock.calls[1][0]);
    expect(formatedWarn).toContain('[33m[NestWinston][39m [33mWarn[39m');
    expect(formatedWarn).toContain('[33mWarning message[39m - {}');

    const formatedError = getMessage(mockLog.mock.calls[2][0]);
    expect(formatedError).toContain('[31m[NestWinston][39m [33mError[39m');
    expect(formatedError).toContain('[31mError message[39m - {"stack":[null]}');
  });
});
