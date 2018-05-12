require 'pp'

ops = File.readlines("opcodes.js").grep(/const/)

operations = {}

ops.each do |op|
  parts = op.split
  operation = parts[1]
  code = parts[3]
  operations[operation] = code
end

def exports(opcodes)
  puts "module.exports = {#{opcodes.keys.join(',')}}"
end

def translation_table(opcodes)
  opcodes.each_pair do |k,v|
    puts "opcodes[#{v.to_i(16)}] = '#{k}';"
  end
end

puts translation_table(operations)
