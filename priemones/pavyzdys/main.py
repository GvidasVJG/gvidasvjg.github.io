# Foo Bar simple Programa

# Vartotojas įveda skaičių
# Vietoj skaičių, dalių iš 3, spausdinama "Foo".
# Vietoj skaičių, dalių iš 5, spausdinama "Bar".
# Vietoj skaičių, dalių iš 3 ir 5, spausdinama "Foo Bar".
# Kitu atveju, skaičius spausdinamas nepakitęs.

n = int(input("Įveskite skaičių: "))
if n % 3 == 0 and n % 5 == 0:
    print("Foo Bar")
elif n % 3 == 0:
    print("Foo")
elif n % 5 == 0:
    print("Bar")
else:
    print(n)