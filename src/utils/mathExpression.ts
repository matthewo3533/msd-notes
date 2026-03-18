type Token =
  | { type: 'number'; value: number }
  | { type: 'op'; value: '+' | '-' | '*' | '/' }
  | { type: 'lparen' }
  | { type: 'rparen' };

const isWhitespace = (ch: string) => ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r';

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const s = input.trim();
  if (!s) return tokens;

  let i = 0;
  while (i < s.length) {
    const ch = s[i];

    if (isWhitespace(ch)) {
      i++;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    // Number (supports decimals). We intentionally do NOT support exponent notation.
    if ((ch >= '0' && ch <= '9') || ch === '.') {
      let j = i + 1;
      while (j < s.length) {
        const c = s[j];
        if ((c >= '0' && c <= '9') || c === '.') j++;
        else break;
      }

      const raw = s.slice(i, j);
      const value = Number(raw);
      if (!Number.isFinite(value)) {
        throw new Error('Invalid number');
      }
      tokens.push({ type: 'number', value });
      i = j;
      continue;
    }

    throw new Error('Invalid character');
  }

  return tokens;
}

function precedence(op: '+' | '-' | '*' | '/'): number {
  return op === '+' || op === '-' ? 1 : 2;
}

function toRpn(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const stack: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    if (t.type === 'number') {
      output.push(t);
      continue;
    }

    if (t.type === 'op') {
      const prev = tokens[i - 1];
      const isUnary =
        !prev ||
        prev.type === 'op' ||
        prev.type === 'lparen';

      // Treat unary +/- as 0 +/- x to keep evaluator simple.
      if (isUnary && (t.value === '+' || t.value === '-')) {
        output.push({ type: 'number', value: 0 });
      } else if (isUnary) {
        throw new Error('Invalid operator placement');
      }

      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.type === 'op' && precedence(top.value) >= precedence(t.value)) {
          output.push(stack.pop() as Token);
        } else {
          break;
        }
      }
      stack.push(t);
      continue;
    }

    if (t.type === 'lparen') {
      stack.push(t);
      continue;
    }

    if (t.type === 'rparen') {
      let found = false;
      while (stack.length) {
        const top = stack.pop() as Token;
        if (top.type === 'lparen') {
          found = true;
          break;
        }
        output.push(top);
      }
      if (!found) throw new Error('Mismatched parentheses');
      continue;
    }
  }

  while (stack.length) {
    const top = stack.pop() as Token;
    if (top.type === 'lparen' || top.type === 'rparen') {
      throw new Error('Mismatched parentheses');
    }
    output.push(top);
  }

  return output;
}

function evalRpn(tokens: Token[]): number {
  const stack: number[] = [];
  for (const t of tokens) {
    if (t.type === 'number') {
      stack.push(t.value);
      continue;
    }
    if (t.type === 'op') {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error('Invalid expression');
      switch (t.value) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          stack.push(a / b);
          break;
      }
      continue;
    }
    throw new Error('Invalid expression');
  }
  if (stack.length !== 1) throw new Error('Invalid expression');
  const result = stack[0];
  if (!Number.isFinite(result)) throw new Error('Invalid result');
  return result;
}

export function tryEvaluateMathExpression(input: string): { ok: true; value: number } | { ok: false } {
  const raw = input.trim();
  if (!raw) return { ok: false };

  // Guardrail: only allow these characters.
  if (!/^[0-9+\-*/().\s]+$/.test(raw)) return { ok: false };

  try {
    const tokens = tokenize(raw);
    if (tokens.length === 0) return { ok: false };
    const rpn = toRpn(tokens);
    const value = evalRpn(rpn);
    return { ok: true, value };
  } catch {
    return { ok: false };
  }
}

