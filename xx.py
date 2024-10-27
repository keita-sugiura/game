def p(a):
    return a+2
def d(a):
    return a-2
x={
    p:p,
    d:d
}
t=x[d]()
