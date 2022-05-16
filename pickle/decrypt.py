import inspect, marshal
x = marshal.loads(open("data.ctf", "rb").read())
print(inspect.getsource(marshal.loads(x)))