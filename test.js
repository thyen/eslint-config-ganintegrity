const { exec } = require('shelljs');
const dedent = require('dedent');
const mockFiles = require('fileception');

const { readFileSync } = require('fs');
const readFile = path => readFileSync(path, 'utf-8');

const expect = require('unexpected')
  .clone()
  .addAssertion('<string> to run', (expect, command) => {
    expect.errorMode = 'bubble';
    return expect(() => {
      const { code } = exec(command);
      expect(code, 'to be', 0);
    }, 'not to error');
  });

describe('eslint-config-gan', () => {
  describe('with the --fix flag', () => {
    it('fixes indentation', () => {
      const unformatted = dedent`function () {
                        var foo = '';
              var bar = '';
      }`;
      const formatted = dedent`function () {
        var foo = '';
        var bar = '';
      }`;

      mockFiles({
        '/foo': {
          'bar.js': unformatted
        }
      });

      expect('eslint --fix /foo/bar.js', 'to run');

      expect(readFile('/foo/bar.js'), 'to be', formatted);
    });
  });
});
